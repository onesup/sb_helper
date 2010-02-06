module SbPopupHelper
  
  def link_to_popup(name, id, html_options = {})
    link_to_function name, "new SB_Popup('#{id.to_s}').showModal()", html_options
  end

  def link_to_close_popup(name, html_options = {})
    link_to_function name, %q{
      var e = $(this).up('.SB_Popup_popup');
      if (e) e.popup.closeModal();
    }, html_options
  end

  def button_to_close_popup(name, html_options = {})
    button_to_function name, %q{
      var e = $(this).up('.SB_Popup_popup');
      if (e) e.popup.closeModal();
    }, html_options
  end

  def link_to_remote_popup(name, link_to_remote_options = {})
    id = id_from_url(link_to_remote_options[:url])
    hidden_content_id = "hidden_content_#{id}"
    link_to_remote_options = build_remote_options_for_modal(link_to_remote_options, hidden_content_id)
    return build_hidden_content(hidden_content_id) + link_to_remote(name, link_to_remote_options)
  end

  def link_to_popup_below(name, popup_id, html_options = {})
    link_to_function(name, 
      "var popup = $('#{popup_id.to_s}').popup;\
      if (!popup) popup = new SB_Popup('#{popup_id.to_s}');\
      popup.togglePopup('below',this)",
      html_options
    )
  end

  def link_to_remote_popup_below(name, link_to_remote_options = {})
    id = id_from_url(link_to_remote_options[:url])
    hidden_content_id = "hidden_content_#{id}"
    link_to_remote_options = build_remote_options(link_to_remote_options, hidden_content_id, :below)
    return build_hidden_content(hidden_content_id) + link_to_remote(name, link_to_remote_options)
  end


  private

    def id_from_url(url_options)
      if url_options.nil?
        raise ArgumentError, 'You are trying to create a content link without specifying a valid url.'
      end
      
      result = if url_options.is_a? String
        url_options.delete(":/")
      else
        url_options.values.join('_')
      end
      
      result.sub(/[?=&]/, '')
    end
  
    def build_hidden_content(hidden_content_id)
      content_tag("div", '', :id => hidden_content_id, :style => 'display:none')
    end
    
    def build_remote_options_for_modal(remote_options, hidden_content_id)
      remote_options[:update] = hidden_content_id

      remote_options[:loading] = "\
        var popup = new SB_Popup('#{hidden_content_id}');\
        popup.showLoading();\
      " + remote_options[:loading].to_s

      remote_options[:complete] = "\
        var popup = $('#{hidden_content_id}').popup;\
        popup.hideLoading();\
        popup.showModal();\
      " + remote_options[:complete].to_s
      
      remote_options
    end
    
    def build_remote_options(remote_options, hidden_content_id, mode)
      remote_options[:update] = hidden_content_id

      base_element_id = hidden_content_id + "_button"

      remote_options[:complete] = "\
        var e = $('#{hidden_content_id}');
        var popup = e.popup;\
        if (!popup) popup = new SB_Popup('#{hidden_content_id}');\
        popup.togglePopup('#{mode.to_s}', '#{base_element_id}');\
      " + remote_options[:complete].to_s
      
      remote_options[:html] ||= {}
      remote_options[:html][:id] = base_element_id
      
      remote_options
    end
  
end
